// taken from https://github.com/reactstrap/reactstrap/blob/7c5e690e985e62b8ac65f9de36abe27a351a48ac/src/utils.js#L47
export function mapToCssModules(className: string, cssModule: any) {
  if (!cssModule) return className;
  return className
    .split(" ")
    .map(c => cssModule[c] || c)
    .join(" ");
}
