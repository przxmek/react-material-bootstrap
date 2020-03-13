export function reformatText(htmlText: string) {
  return htmlText
    .replace(/<br>/g, '')
    .replace(/<br \/>\n/g, '<br>')
    .replace(/<\/p><p>/g, '<br>')
    .replace(/<p>|<\/p>/g, '');
}