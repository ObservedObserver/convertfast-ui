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
    {
        name: 'CTA',
        file: 'cta',
        components: [
            {
                name: 'Button',
                file: 'button',
                source: 'shadcn'
            }
        ]
    },
    {
        name: 'FAQ',
        file: 'faq',
        components: [
            {
                name: 'Accordion',
                file: 'accordion',
                source: 'shadcn'
            }
        ]
    }
]