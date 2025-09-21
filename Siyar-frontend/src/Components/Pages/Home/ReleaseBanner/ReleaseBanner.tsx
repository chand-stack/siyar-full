import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaBolt } from 'react-icons/fa6';
import book from '../../../../assets/book.png'

const ReleaseBanner: React.FC = () => {
	const { t, i18n } = useTranslation();

	// Function to get font class based on language
	const getFontClass = (language: string) => {
		switch (language) {
			case 'ar': return 'font-cairo';
			case 'id': return 'font-cairo';
			case 'tr': return 'font-roboto';
			default: return 'font-cairo';
		}
	};

	return (
		<section className="w-full bg-[#cfe3fb]">
			{/* No bottom padding on small; full padding on md+ */}
			<div className="container mx-auto px-6 pt-12 pb-0 md:pt-16 md:pb-16">
				{/* Mobile / Tablet layout (centered, floating CTA) */}
				<div className="flex flex-col items-center text-center lg:hidden">
					<div className="flex items-center gap-2 mb-4 text-black">
						<FaBolt className="text-[#0054FF]" />
						<span className={`uppercase tracking-wider text-sm font-semibold ${getFontClass(i18n.language)}`}>
							{t('releaseBanner.label')}
						</span>
					</div>
					<h2 className={`text-3xl md:text-5xl font-extrabold text-black mb-3 ${getFontClass(i18n.language)}`}>
						{t('releaseBanner.title')}
					</h2>
					<p className={`text-black text-lg md:text-xl max-w-3xl mb-8 ${getFontClass(i18n.language)}`}>
						{t('releaseBanner.description')}
					</p>
					{/* Centered book image with floating button */}
					<div className="relative overflow-hidden w-[260px] h-[360px] md:w-[320px] md:h-[440px] rounded shadow-xl ring-1 ring-black/5 bg-white/60">
						<img src={book} alt="book" className="absolute inset-0 w-full h-full object-cover scale-[1.06] translate-y-3" />
						<button className={`inline-flex items-center justify-center whitespace-nowrap leading-none btn normal-case bg-white text-[#0054FF] hover:bg-white border-0 rounded-md h-12 md:h-14 px-7 md:px-9 text-lg md:text-xl font-bold absolute left-1/2 -translate-x-1/2 bottom-6 shadow-lg min-w-[220px] ${getFontClass(i18n.language)}`}>
							{t('releaseBanner.cta')}
						</button>
					</div>
				</div>

				{/* Desktop layout (image left, content right) */}
				<div className="hidden lg:block">
					<div className="mx-auto max-w-[1200px] grid grid-cols-12 gap-16 items-center">
						{/* Left: Image placeholder */}
						<div className="col-span-3 flex justify-center lg:justify-start">
							<img src={book} alt="book" className="w-60 h-[330px] bg-white/60 rounded shadow-xl ring-1 ring-black/5 grid place-content-center" />
						</div>
						{/* Right: Text + CTA */}
						<div className="col-span-9">
							<div className="flex items-center gap-2 text-black mb-3">
								<FaBolt className="text-[#0054FF]" />
								<span className={`uppercase tracking-wider text-sm font-semibold ${getFontClass(i18n.language)}`}>
									{t('releaseBanner.label')}
								</span>
							</div>
							<h2 className={`text-5xl font-extrabold text-black mb-4 ${getFontClass(i18n.language)}`}>
								{t('releaseBanner.title')}
							</h2>
							<p className={`text-black text-xl max-w-3xl mb-6 ${getFontClass(i18n.language)}`}>
								{t('releaseBanner.description')}
							</p>
							<button className={`inline-flex items-center justify-center whitespace-nowrap leading-none btn normal-case bg-[#0054FF] hover:bg-[#0046d6] text-white px-8 h-12 text-lg rounded-md font-bold min-w-[220px] ${getFontClass(i18n.language)}`}>
								{t('releaseBanner.cta')}
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ReleaseBanner;
