import React, { useState } from 'react';
import { FaPlay, FaPlus } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { useGetVideosQuery, type IVideo } from '../../../Redux/api/videoApi';
import VideoModal from '../../Shared/VideoModal';
import banner from '../../../assets/category-bg.jpg';
import { googleTranslationService, type SupportedLanguage } from '../../../services/googleTranslationService';

const VideoListing: React.FC = () => {
	const { i18n } = useTranslation();
	const [currentPage, setCurrentPage] = useState(1);
	const videosPerPage = 9;
	const [isTranslating, setIsTranslating] = useState(false);
	
	// Modal state
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedVideo, setSelectedVideo] = useState<IVideo | null>(null);

	// State for translated banner text
	const [translatedBannerText, setTranslatedBannerText] = useState({
		watch: 'Watch',
		videos: 'Videos'
	});

	const { data: videosResponse, isLoading, error } = useGetVideosQuery({
		page: currentPage,
		limit: videosPerPage,
		status: 'published'
	});

	const videos = videosResponse?.data?.items || [];
	const totalVideos = videosResponse?.data?.total || 0;
	const hasMoreVideos = totalVideos > currentPage * videosPerPage;

	// State for translated videos
	type TranslatedVideo = IVideo & { translatedTitle?: string };
	const [translatedVideos, setTranslatedVideos] = useState<TranslatedVideo[]>([]);

	// Function to get font class based on language
	const getFontClass = (language: string) => {
		switch (language) {
			case 'ar': return 'font-cairo';
			case 'id': return 'font-cairo';
			case 'tr': return 'font-roboto';
			default: return 'font-cairo';
		}
	};

	// Effect to translate banner text when language changes
	React.useEffect(() => {
		const translateBannerText = async () => {
			if (i18n.language === 'en') {
				setTranslatedBannerText({
					watch: 'Watch',
					videos: 'Videos'
				});
				return;
			}

			try {
				console.log(`🔄 Translating banner text to: ${i18n.language}`);
				const currentLanguage = i18n.language as SupportedLanguage;
				const bannerTexts = ['Watch', 'Videos'];
				
				const translatedTexts = await googleTranslationService.translateBatch(bannerTexts, currentLanguage);
				
				setTranslatedBannerText({
					watch: translatedTexts[0] || 'Watch',
					videos: translatedTexts[1] || 'Videos'
				});
				
				console.log(`✅ Banner text translated:`, translatedTexts);
			} catch (error) {
				console.warn('❌ Failed to translate banner text:', error);
				// Keep original text as fallback
				setTranslatedBannerText({
					watch: 'Watch',
					videos: 'Videos'
				});
			}
		};

		translateBannerText();
	}, [i18n.language]);

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
					
					console.log(`🌐 Translating ${videoTitles.length} videos to ${currentLanguage}`);
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

	// Memoize the videos array to prevent unnecessary re-renders
	const displayVideos = React.useMemo(() => {
		return translatedVideos.length > 0 ? translatedVideos : videos;
	}, [translatedVideos, videos]);

	// Handle loading more videos
	const handleLoadMore = () => {
		setCurrentPage(prev => prev + 1);
	};

	// Modal handlers
	const openVideoModal = (video: IVideo) => {
		setSelectedVideo(video);
		setIsModalOpen(true);
	};

	const closeVideoModal = () => {
		setIsModalOpen(false);
		setSelectedVideo(null);
	};

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

	if ((isLoading && currentPage === 1) || (videos.length > 0 && isTranslating)) {
		return (
			<div className="bg-white">
				{/* Loading Banner */}
				<section className="relative w-full">
					<div className="w-full h-64 md:h-80 lg:h-[360px] bg-gray-200 animate-pulse"></div>
					<div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
						<div className="w-32 h-8 bg-white/20 animate-pulse rounded"></div>
						<div className="w-64 h-12 bg-white/20 animate-pulse rounded mt-4"></div>
					</div>
				</section>

				{/* Loading Cards */}
				<section className="py-12">
					<div className="container mx-auto px-6">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
							{Array.from({ length: 6 }).map((_, idx) => (
								<div key={idx} className="animate-pulse">
									<div className="w-full h-72 md:h-96 lg:h-[460px] bg-gray-200 rounded-2xl"></div>
									<div className="pt-4 md:pt-5">
										<div className="w-full h-8 bg-gray-200 rounded"></div>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-white">
				<section className="relative w-full">
					<div className="w-full h-64 md:h-80 lg:h-[360px] bg-gray-100"></div>
				<div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
					<h1 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 ${getFontClass(i18n.language)}`}>
						{translatedBannerText.videos}
					</h1>
				</div>
				</section>

				<section className="py-12">
					<div className="container mx-auto px-6 text-center">
						<h3 className={`text-2xl font-semibold text-gray-600 mb-4 ${getFontClass(i18n.language)}`}>
							Error loading videos
						</h3>
						<p className={`text-gray-500 ${getFontClass(i18n.language)}`}>
							Please try again later
						</p>
					</div>
				</section>
			</div>
		);
	}

	return (
		<div className="bg-white">
			{/* Banner */}
			<section className="relative w-full">
				<img src={banner} alt="banner" className="w-full h-64 md:h-80 lg:h-[360px] object-cover" />
				<div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
					<p className={`uppercase tracking-widest text-xs md:text-sm opacity-90 ${getFontClass(i18n.language)}`}>
						{translatedBannerText.watch}
					</p>
					<h1 className={`mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold drop-shadow ${getFontClass(i18n.language)}`}>
						{translatedBannerText.videos}
					</h1>
				</div>
			</section>

			{/* Videos Grid */}
			<section className="py-12">
				<div className="container mx-auto px-6">
					{displayVideos.length > 0 ? (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
								{displayVideos.map((video) => {
									const videoId = extractYouTubeId(video.videoLink);
									const translatedVideo = video as TranslatedVideo;
									return (
										<div 
											key={video._id} 
											className="group cursor-pointer"
											onClick={() => openVideoModal(video)}
										>
											<div className="relative overflow-hidden rounded-2xl h-72 md:h-96 lg:h-[460px] bg-black">
												<img
													src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
													alt={translatedVideo.translatedTitle || video.title}
													className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
												/>
												{/* Dark overlay */}
												<div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />
												
												{/* Play button overlay */}
												<div className="absolute inset-0 flex items-center justify-center">
													<div className="w-20 h-20 rounded-full bg-white/90 grid place-content-center shadow-lg group-hover:bg-white group-hover:scale-110 transition-all duration-300">
														<FaPlay size={32} className="text-[#0054FF] ml-1" />
													</div>
												</div>

												{/* Views count */}
												{video.views && (
													<div className={`absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm ${getFontClass(i18n.language)}`}>
														{video.views} views
													</div>
												)}
											</div>
											
											<div className="pt-4 md:pt-5">
												<h3 className={`text-[22px] md:text-3xl lg:text-4xl font-extrabold text-black uppercase leading-[1.1] tracking-tight group-hover:text-[#0054FF] transition-colors duration-300 ${getFontClass(i18n.language)}`}>
													{translatedVideo.translatedTitle || video.title}
												</h3>
												{video.createdAt && (
													<p className={`text-sm text-gray-500 mt-2 ${getFontClass(i18n.language)}`}>
														{new Date(video.createdAt).toLocaleDateString()}
													</p>
												)}
											</div>
										</div>
									);
								})}
							</div>

							{/* More button - only show if there are more than 9 videos */}
							{hasMoreVideos && (
								<div className="pt-10 md:pt-12 flex justify-center">
									<button 
										onClick={handleLoadMore}
										className={`inline-flex items-center gap-2 bg-white text-[#03045E] border-2 border-[#0054FF] rounded-2xl h-12 md:h-14 px-8 md:px-10 text-base md:text-lg font-semibold hover:bg-[#0054FF] hover:text-white transition-colors duration-300 ${getFontClass(i18n.language)}`}
									>
										<FaPlus className="text-[#0054FF] group-hover:text-white" />
										Load More ({totalVideos - (currentPage * videosPerPage)} remaining)
									</button>
								</div>
							)}
						</>
					) : (
						<div className="text-center py-16">
							<h3 className={`text-2xl font-semibold text-gray-600 mb-4 ${getFontClass(i18n.language)}`}>
								No videos found
							</h3>
							<p className={`text-gray-500 ${getFontClass(i18n.language)}`}>
								Check back later for new video content
							</p>
						</div>
					)}
				</div>
			</section>

			{/* Video Modal */}
			<VideoModal 
				isOpen={isModalOpen}
				onClose={closeVideoModal}
				video={selectedVideo}
			/>
		</div>
	);
};

export default VideoListing;
