export type IComponent = {
    name: string;
    file: string;
    source: 'shadcn' | 'convertfast'
}
export type ISegment = {
	name: string;
	file: string;
    components?: IComponent[]
}