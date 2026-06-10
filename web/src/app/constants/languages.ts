export const LANGUAGES = ['ts', 'js', 'py', 'sh', 'json', 'yml', 'md', 'sql', 'html', 'css', 'other'] as const;
export type Language = (typeof LANGUAGES)[number];
