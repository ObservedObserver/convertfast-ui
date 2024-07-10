import { ISegment } from "../interfaces";

export const DEFAULT_SEGMETS: ISegment[] = [
	{
		name: 'HeroSection',
		file: 'hero-section',
		components: [
            {
                name: 'Button',
                file: 'button',
                source: 'shadcn'
            }
        ]
	},
	{
		name: 'FeatureSection',
		file: 'feature-section',
        components: [
            {
                name: 'Button',
                file: 'button',
                source: 'shadcn'
            }
        ]
	},
]