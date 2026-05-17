// src/rendering/shared/code.shared.template.tsx

type CodeTemplateProps = Readonly<{
  value: string;
  language?: string | null;
}>;

export const CodeTemplate = ({ value, language = null }: CodeTemplateProps) => {
  const className = language ? `language-${language}` : undefined;

  return <code className={className}>{value}</code>;
};
