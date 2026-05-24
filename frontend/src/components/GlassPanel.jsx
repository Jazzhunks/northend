/** Universal glass spatial-UI container. Used across the public site. */
export default function GlassPanel({ children, className = "", elevated = false, as: Tag = "div", ...rest }) {
  const cls = `${elevated ? "glass-elevated" : "glass"} rounded-2xl ${className}`;
  return <Tag className={cls} {...rest}>{children}</Tag>;
}
