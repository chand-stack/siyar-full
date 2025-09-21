
import HomeBanner from './HomeBanner/HomeBanner';
import Categories from './Categories';
import Featured from './Featured';
import VideoSection from './VideoSection';
import ReleaseBanner from './ReleaseBanner';
import LatestSection from './LatestSection';
import Instagram from './Instagram';

const Home = () => {
	return (
		<div>
			<HomeBanner />
			<Categories />
			<Featured />
			<VideoSection />
			<ReleaseBanner />
			<LatestSection />
			<Instagram />
		</div>
	);
};

export default Home;