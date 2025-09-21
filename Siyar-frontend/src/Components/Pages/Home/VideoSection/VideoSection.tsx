import React, { useState } from 'react';
import { FaPlay } from 'react-icons/fa6';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useGetVideosQuery, type IVideo } from '../../../../Redux/api/videoApi';
import VideoModal from '../../../Shared/VideoModal';
import { googleTranslationService, type SupportedLanguage } from '../../../../services/googleTranslationService';

function extractYouTubeId(url: string): string {
	try {
		const u = new URL(url);
		if (u.hostname.includes('youtu.be')) {
			return u.pathname.slice(1);
		}
		if (u.searchParams.get('v')) {
			return u.searchParams.get('v') || '';
		}
		// Fallback for embed links
		const parts = u.pathname.split('/');
		return parts[parts.length - 1];
	} catch {
		return url;
	}
}

const VideoSection: React.FC = () => {
	const { t, i18n } = useTranslation();
	
	// Modal state
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedVideo, setSelectedVideo] = useState<IVideo | null>(null);
	
	// Translation state
	const [isTranslating, setIsTranslating] = useState(false);
	
	// Type for translated videos
	type TranslatedVideo = IVideo & { translatedTitle?: string };
	const [translatedVideos, setTranslatedVideos] = useState<TranslatedVideo[]>([]);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
				delayChildren: 0.1
			}
		}
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut" as const
			}
		}
	};

	// First try to get featured videos
	const { data: featuredVideosResponse, isLoading: featuredLoading, error: featuredError } = useGetVideosQuery({ 
		limit: 3, 
		featured: "true", // Backend expects string "true"
		status: 'published'
	});

	// Fallback: if no featured videos, get any published videos
	const { data: fallbackVideosResponse, isLoading: fallbackLoading } = useGetVideosQuery({ 
		limit: 3, 
		status: 'published'
	}, {
		skip: featuredVideosResponse?.data?.items && featuredVideosResponse.data.items.length > 0
	});

	const isLoading = featuredLoading || fallbackLoading || isTranslating;
	const error = featuredError;
	
	// Use featured videos if available, otherwise use fallback videos (memoized)
	const videos = React.useMemo(() => {
		return (featuredVideosResponse?.data?.items && featuredVideosResponse.data.items.length > 0) 
			? featuredVideosResponse.data.items 
			: (fallbackVideosResponse?.data?.items || []);
	}, [featuredVideosResponse?.data?.items, fallbackVideosResponse?.data?.items]);

	// Modal handlers
	const openVideoModal = (video: IVideo) => {
		setSelectedVideo(video);
		setIsModalOpen(true);
	};

	const closeVideoModal = () => {
		setIsModalOpen(false);
		setSelectedVideo(null);
	};

	// Function to get font class based on language
	const getFontClass = (language: string) => {
		switch (language) {
			case 'ar': return 'font-cairo';
			case 'id': return 'font-cairo';
			case 'tr': return 'font-roboto';
			default: return 'font-cairo';
		}
	};

	// Effect to translate videos when data or language changes
	React.useEffect(() => {
		const translateVideos = async () => {
			if (videos.length > 0) {
				console.log(`🔄 Starting video translation to: ${i18n.language}`);
				console.log(`📋 Videos to translate:`, videos.map(v => v.title));
				
				setIsTranslating(true);
				
				try {
					// Extract all video titles
					const videoTitles = videos.map(video => video.title);
					
					// Use batch translation for better performance
					const currentLanguage = i18n.language as SupportedLanguage;
					
					console.log(`🌐 Translating ${videoTitles.length} video titles to ${currentLanguage}`);
					const translatedTitles = await googleTranslationService.translateBatch(videoTitles, currentLanguage);
					
					console.log(`✅ Video translation results:`, translatedTitles);
					
					// Map translated titles back to videos
					const translated = videos.map((video, index) => ({
						...video,
						translatedTitle: translatedTitles[index] || video.title
					}));
					
					setTranslatedVideos(translated);
					console.log(`🎯 Videos translation completed successfully`);
				} catch (error) {
					console.error('❌ Failed to translate videos:', error);
					// Fallback to original titles
					const fallback = videos.map(video => ({
						...video,
						translatedTitle: video.title
					}));
					setTranslatedVideos(fallback);
				} finally {
					setIsTranslating(false);
				}
			}
		};

		translateVideos();
	}, [videos, i18n.language]);

	// Debug logging
	console.log('VideoSection - Featured API Response:', featuredVideosResponse);
	console.log('VideoSection - Fallback API Response:', fallbackVideosResponse);
	console.log('VideoSection - Loading States:', { featuredLoading, fallbackLoading, isLoading });
	console.log('VideoSection - Error:', error);
	console.log('VideoSection - Final Videos:', videos);

	if (isLoading) {
		return (
			<section className="bg-white py-12">
				<div className="container mx-auto px-6">
					<div className="h-px bg-[#03045E]/20 mb-6" />
					<motion.div 
						className="mb-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h2 className="text-xs md:text-sm tracking-[0.2em] font-semibold text-[#03045E] uppercase">
							{t('home.video.title')}
						</h2>
					</motion.div>
					<motion.div 
						className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
						variants={containerVariants}
						initial="hidden"
						animate="visible"
					>
						<motion.div className="lg:col-span-8" variants={itemVariants}>
							<div className="w-full h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
							<div className="mt-6 w-3/4 h-8 bg-gray-200 rounded animate-pulse"></div>
						</motion.div>
						<motion.div className="lg:col-span-4" variants={itemVariants}>
							<div className="space-y-6">
								{Array.from({ length: 2 }).map((_, idx) => (
									<motion.div key={idx} className="grid grid-cols-[160px_1fr] gap-4 items-center" variants={itemVariants}>
										<div className="w-40 h-40 bg-gray-200 rounded-2xl animate-pulse"></div>
										<div className="w-full h-6 bg-gray-200 rounded animate-pulse"></div>
									</motion.div>
								))}
							</div>
						</motion.div>
					</motion.div>
				</div>
			</section>
		);
	}

	if (error) {
		console.error('VideoSection - Error:', error);
		return (
			<section className="bg-white py-12">
				<div className="container mx-auto px-6">
					<div className="h-px bg-[#03045E]/20 mb-6" />
					<motion.div 
						className="mb-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h2 className="text-xs md:text-sm tracking-[0.2em] font-semibold text-[#03045E] uppercase">
							{t('home.video.title')}
						</h2>
					</motion.div>
					<div className="text-center py-8">
						<p className="text-gray-500">Unable to load videos at the moment</p>
						<pre className="mt-2 text-xs text-gray-400 bg-gray-100 p-2 rounded">
							{JSON.stringify(error, null, 2)}
						</pre>
					</div>
				</div>
			</section>
		);
	}

	if (videos.length === 0) {
		console.log('VideoSection - No videos found');
		return (
			<section className="bg-white py-12">
				<div className="container mx-auto px-6">
					<div className="h-px bg-[#03045E]/20 mb-6" />
					<motion.div 
						className="mb-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h2 className="text-xs md:text-sm tracking-[0.2em] font-semibold text-[#03045E] uppercase">
							{t('home.video.title')}
						</h2>
					</motion.div>
					<div className="text-center py-8">
						<p className="text-gray-500">No videos available at the moment</p>
						<Link to="/videos" className="mt-4 inline-block text-[#0054FF] hover:underline">
							Browse all videos
						</Link>
					</div>
				</div>
			</section>
		);
	}

	// Use translated videos if available, otherwise use original videos with empty translatedTitle
	const displayVideos: TranslatedVideo[] = translatedVideos.length > 0 
		? translatedVideos 
		: videos.map(v => ({ ...v, translatedTitle: undefined }));
	const hero = displayVideos[0];
	const heroId = hero ? extractYouTubeId(hero.videoLink) : '';

	// Safety check - if no hero video, return early
	if (!hero) {
		return (
			<section className="bg-white py-12">
				<div className="container mx-auto px-6">
					<div className="h-px bg-[#03045E]/20 mb-6" />
					<motion.div 
						className="mb-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h2 className="text-xs md:text-sm tracking-[0.2em] font-semibold text-[#03045E] uppercase">
							{t('home.video.title')}
						</h2>
					</motion.div>
					<div className="text-center py-8">
						<p className="text-gray-500">No videos available at the moment</p>
						<Link to="/videos" className="mt-4 inline-block text-[#0054FF] hover:underline">
							Browse all videos
						</Link>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="bg-white py-12">
			<div className="container mx-auto px-6">
				{/* Top divider line */}
				<div className="h-px bg-[#03045E]/20 mb-6" />

				{/* Header */}
				<motion.div 
					className="mb-6"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<h2 className="text-xs md:text-sm tracking-[0.2em] font-semibold text-[#03045E] uppercase">
						{t('home.video.title')}
					</h2>
				</motion.div>

				<motion.div 
					className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					{/* Hero Video */}
					<motion.div className="lg:col-span-8" variants={itemVariants}>
						<div className="relative rounded-2xl overflow-hidden aspect-video bg-black">
							<iframe
								title={hero.title}
								src={`https://www.youtube.com/embed/${heroId}?rel=0&modestbranding=1`}
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								allowFullScreen
								className="absolute inset-0 w-full h-full"
							/>
							{/* Floating Play Badge */}
							<div className="absolute left-4 bottom-4 w-14 h-14 rounded-full bg-white grid place-content-center shadow-lg">
								<div className="w-10 h-10 rounded-full bg-[#0054FF] text-white grid place-content-center">
									<FaPlay className="ml-0.5" />
								</div>
							</div>
						</div>

						<h3 className={`mt-6 text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0054FF] uppercase leading-[1.1] ${getFontClass(i18n.language)}`}>
							{hero.translatedTitle || hero.title}
						</h3>
					</motion.div>

					{/* Sidebar List - Only show 2 videos */}
					<motion.div className="lg:col-span-4" variants={itemVariants}>
						<div className="space-y-6">
							{displayVideos.slice(1, 3).map((v) => {
								const id = extractYouTubeId(v.videoLink);
								return (
									<motion.div 
										key={v._id} 
										className="grid grid-cols-[160px_1fr] gap-4 items-center cursor-pointer group"
										onClick={() => openVideoModal(v)}
										variants={itemVariants}
									>
										<div className="relative w-40 aspect-square rounded-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
											<img
												src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
												alt={v.translatedTitle || v.title}
												className="absolute inset-0 w-full h-full object-cover"
											/>
											{/* Slight dark overlay for better contrast */}
											<div className="absolute inset-0 bg-black/45 group-hover:bg-black/60 transition-colors duration-300" />
											{/* Centered white play icon without bg */}
											<div className="absolute inset-0 grid place-content-center z-10">
												<div className="w-12 h-12 rounded-full bg-white/90 grid place-content-center transition-all duration-300 group-hover:bg-white group-hover:scale-110">
													<FaPlay size={20} className="text-[#0054FF] ml-0.5" />
												</div>
											</div>
										</div>
										<p className={`font-extrabold uppercase text-[#000] leading-tight text-sm group-hover:text-[#0054FF] transition-colors duration-300 ${getFontClass(i18n.language)}`}>
											{v.translatedTitle || v.title}
										</p>
									</motion.div>
								);
							})}
						</div>

						{/* See all button - redirects to video listing page */}
						<Link to="/videos" className="mt-8 text-gray-800 hover:text-[#0054FF] text-base md:text-lg block">
							{t('common.seeAll')}
						</Link>
					</motion.div>
				</motion.div>
			</div>

			{/* Video Modal */}
			<VideoModal 
				isOpen={isModalOpen}
				onClose={closeVideoModal}
				video={selectedVideo}
			/>
		</section>
	);
};

export default VideoSection;
