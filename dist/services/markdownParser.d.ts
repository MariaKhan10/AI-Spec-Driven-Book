import type { Root } from 'mdast';
/**
 * Service for parsing and transforming Markdown content using AST
 */
export declare class MarkdownParser {
    /**
     * Parse Markdown content into AST
     */
    parseToAst(content: string): Promise<Root>;
    /**
     * Transform Markdown AST based on complexity level
     */
    transformAstByComplexity(ast: Root, complexity: 'beginner' | 'intermediate' | 'advanced'): Root;
    /**
     * Transform AST for beginner level
     */
    private transformForBeginner;
    /**
     * Transform AST for intermediate level
     */
    private transformForIntermediate;
    /**
     * Transform AST for advanced level
     */
    private transformForAdvanced;
    /**
     * Convert AST back to Markdown string
     */
    astToString(ast: Root): Promise<string>;
    /**
     * Transform Markdown content directly
     */
    transformContent(content: string, complexity: 'beginner' | 'intermediate' | 'advanced'): Promise<string>;
    /**
     * Preserve structure elements like headings, code blocks, links, etc.
     */
    preserveStructure(ast: Root): Root;
    /**
     * Extract learning objectives from content
     */
    extractLearningObjectives(ast: Root): string[];
    /**
     * Extract text content from a node
     */
    private extractTextFromNode;
    /**
     * Count words in content (for complexity assessment)
     */
    countWords(ast: Root): number;
}
export declare const markdownParser: MarkdownParser;
//# sourceMappingURL=markdownParser.d.ts.map