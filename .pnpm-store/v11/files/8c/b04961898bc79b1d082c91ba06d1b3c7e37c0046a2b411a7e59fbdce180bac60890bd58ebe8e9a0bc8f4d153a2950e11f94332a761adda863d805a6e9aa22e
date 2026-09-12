import { CSSProperties } from "react";
//#region src/types.d.ts
/**
 * Value of the `text-fit` longhand: `[ none | grow | shrink ] [ consistent | per-line | per-line-all ]? <percentage>?`.
 *
 * @see https://drafts.csswg.org/css-text-4/#text-fit-property
 */
type TextFit = "none" | "grow" | "shrink" | "consistent" | "per-line" | "per-line-all" | `${number}%` | (string & {});
declare module "react" {
  interface CSSProperties {
    textFit?: TextFit;
  }
}
type NodeAttributes = Record<string, string>;
/**
 * A JSX element from any React-shaped runtime; Preact vnodes fit too, so
 * `fromJsx` and the render inputs accept them without casts.
 */
type ReactElementLike = {
  type: string | symbol | ((props: never) => unknown) | (new (props: never) => unknown) | ReactElementLike;
  props: unknown;
  $$typeof?: symbol | string;
};
type NodeMetadata = {
  tagName?: string;
  className?: string;
  id?: string;
  dir?: "ltr" | "rtl";
  lang?: string;
  attributes?: NodeAttributes;
  tw?: string;
  style?: CSSProperties;
  preset?: CSSProperties;
};
type Node = ContainerNode | TextNode | ImageNode;
type ContainerNode = NodeMetadata & {
  type: "container";
  children?: Node[];
};
type TextNode = NodeMetadata & {
  type: "text";
  text: string;
};
/** Raw row-major RGBA pixels, rendered without decoding. */
type RgbaImage = {
  /** The image width in pixels. */
  width: number;
  /** The image height in pixels. */
  height: number;
  /** RGBA bytes, `width * height * 4` long. */
  data: Uint8Array | ArrayBuffer;
  /** The bytes are already alpha-premultiplied, so the premultiply pass is skipped. */
  premultiplied?: boolean;
};
type ImageNode = NodeMetadata & {
  type: "image";
  src: string | Uint8Array | ArrayBuffer | RgbaImage;
  width?: number;
  height?: number;
};
//#endregion
export { NodeMetadata as a, TextFit as c, NodeAttributes as i, TextNode as l, ImageNode as n, ReactElementLike as o, Node as r, RgbaImage as s, ContainerNode as t };