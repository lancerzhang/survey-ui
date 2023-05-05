import DOMPurify from 'dompurify';

const QuillContent = (props) => {
    const sanitizedHtmlContent = DOMPurify.sanitize(props.children);
    return <div dangerouslySetInnerHTML={{ __html: sanitizedHtmlContent }} />;
};

export default QuillContent;
