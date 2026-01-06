"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownParser = exports.MarkdownParser = void 0;
const unified_1 = require("unified");
const remark_parse_1 = __importDefault(require("remark-parse"));
const remark_rehype_1 = __importDefault(require("remark-rehype"));
const rehype_stringify_1 = __importDefault(require("rehype-stringify"));
const unist_util_visit_1 = require("unist-util-visit");
/**
 * Service for parsing and transforming Markdown content using AST
 */
class MarkdownParser {
    /**
     * Parse Markdown content into AST
     */
    async parseToAst(content) {
        const file = await (0, unified_1.unified)()
            .use(remark_parse_1.default)
            .parse(content);
        return file;
    }
    /**
     * Transform Markdown AST based on complexity level
     */
    transformAstByComplexity(ast, complexity) {
        // Create a deep copy of the AST to avoid modifying the original
        const transformedAst = JSON.parse(JSON.stringify(ast));
        // Apply transformations based on complexity level
        switch (complexity) {
            case 'beginner':
                return this.transformForBeginner(transformedAst);
            case 'intermediate':
                return this.transformForIntermediate(transformedAst);
            case 'advanced':
                return this.transformForAdvanced(transformedAst);
            default:
                return transformedAst;
        }
    }
    /**
     * Transform AST for beginner level
     */
    transformForBeginner(ast) {
        // Add more descriptive text, simplify language, add analogies
        (0, unist_util_visit_1.visit)(ast, 'paragraph', (node) => {
            if (node.type === 'paragraph') {
                // In a real implementation, we would transform the paragraph content
                // to be more beginner-friendly
                // For now, we'll just add a simple transformation marker
                node.data = {
                    ...node.data,
                    transformed: true,
                    complexity: 'beginner'
                };
            }
        });
        // Add more explanations for code blocks
        (0, unist_util_visit_1.visit)(ast, 'code', (node) => {
            if (node.type === 'code' && node.data) {
                node.data = {
                    ...node.data,
                    transformed: true,
                    complexity: 'beginner',
                    explanationAdded: true
                };
            }
        });
        // Add more descriptive headings
        (0, unist_util_visit_1.visit)(ast, 'heading', (node) => {
            if (node.type === 'heading') {
                node.data = {
                    ...node.data,
                    transformed: true,
                    complexity: 'beginner'
                };
            }
        });
        return ast;
    }
    /**
     * Transform AST for intermediate level
     */
    transformForIntermediate(ast) {
        // Add practical tips and moderate examples
        (0, unist_util_visit_1.visit)(ast, 'paragraph', (node) => {
            if (node.type === 'paragraph') {
                node.data = {
                    ...node.data,
                    transformed: true,
                    complexity: 'intermediate'
                };
            }
        });
        // Add code snippets and practical examples
        (0, unist_util_visit_1.visit)(ast, 'code', (node) => {
            if (node.type === 'code' && node.data) {
                node.data = {
                    ...node.data,
                    transformed: true,
                    complexity: 'intermediate',
                    practicalExamplesAdded: true
                };
            }
        });
        return ast;
    }
    /**
     * Transform AST for advanced level
     */
    transformForAdvanced(ast) {
        // Add detailed explanations and advanced techniques
        (0, unist_util_visit_1.visit)(ast, 'paragraph', (node) => {
            if (node.type === 'paragraph') {
                node.data = {
                    ...node.data,
                    transformed: true,
                    complexity: 'advanced'
                };
            }
        });
        // Add advanced code examples and optimizations
        (0, unist_util_visit_1.visit)(ast, 'code', (node) => {
            if (node.type === 'code' && node.data) {
                node.data = {
                    ...node.data,
                    transformed: true,
                    complexity: 'advanced',
                    advancedExamplesAdded: true
                };
            }
        });
        return ast;
    }
    /**
     * Convert AST back to Markdown string
     */
    async astToString(ast) {
        const file = await (0, unified_1.unified)()
            .use(remark_rehype_1.default)
            .use(rehype_stringify_1.default)
            .process({ ...ast, value: '' });
        return String(file.value);
    }
    /**
     * Transform Markdown content directly
     */
    async transformContent(content, complexity) {
        try {
            // Parse to AST
            const ast = await this.parseToAst(content);
            // Transform based on complexity
            const transformedAst = this.transformAstByComplexity(ast, complexity);
            // Convert back to string
            return await this.astToString(transformedAst);
        }
        catch (error) {
            console.error('Error transforming content with AST:', error);
            // Return original content if transformation fails
            return content;
        }
    }
    /**
     * Preserve structure elements like headings, code blocks, links, etc.
     */
    preserveStructure(ast) {
        // This method would ensure that structure elements are preserved
        // during transformation. The current implementation already preserves
        // structure through the unified/remark/rehype pipeline.
        return ast;
    }
    /**
     * Extract learning objectives from content
     */
    extractLearningObjectives(ast) {
        const objectives = [];
        (0, unist_util_visit_1.visit)(ast, 'paragraph', (node) => {
            if (node.type === 'paragraph') {
                // Look for common learning objective patterns
                // This is a simplified implementation
                const text = this.extractTextFromNode(node);
                if (text.toLowerCase().includes('objective') ||
                    text.toLowerCase().includes('learn') ||
                    text.toLowerCase().includes('understand')) {
                    objectives.push(text);
                }
            }
        });
        return objectives;
    }
    /**
     * Extract text content from a node
     */
    extractTextFromNode(node) {
        if (node.type === 'text') {
            return node.value;
        }
        if ('children' in node && Array.isArray(node.children)) {
            return node.children.map(child => this.extractTextFromNode(child)).join(' ');
        }
        return '';
    }
    /**
     * Count words in content (for complexity assessment)
     */
    countWords(ast) {
        let count = 0;
        (0, unist_util_visit_1.visit)(ast, 'text', (node) => {
            if (node.type === 'text') {
                count += node.value.trim().split(/\s+/).filter(word => word.length > 0).length;
            }
        });
        return count;
    }
}
exports.MarkdownParser = MarkdownParser;
// Export singleton instance
exports.markdownParser = new MarkdownParser();
//# sourceMappingURL=markdownParser.js.map