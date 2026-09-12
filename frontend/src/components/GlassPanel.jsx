/** Universal glass spatial-UI container. Used across the public site. */
export default function GlassPanel({ children, className = "", elevated = false, as: Tag = "div", ...rest }) {
  const cls = elevated ? `glass-elevated ${className}` : `glass ${className}`;
  return <Tag className={cls} {...rest}>{children}</Tag>;
}
