import DOMPurify from 'dompurify';

const HtmlContent = (props) => {
    const sanitizedHtmlContent = DOMPurify.sanitize(props.children);
    return <div dangerouslySetInnerHTML={{ __html: sanitizedHtmlContent }} />;
};

export default HtmlContent;
