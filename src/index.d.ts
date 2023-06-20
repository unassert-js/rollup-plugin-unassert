import type { UnassertCodeOptions } from "unassert";
import type { FilterPattern } from "@rollup/pluginutils";
import type { Plugin } from "rollup";

export type Options = Partial<{
  include: FilterPattern;
  exclude: FilterPattern;
  sourcemap: boolean;
  unassertOptions: Omit<UnassertCodeOptions, "sourceMap">;
}>;

export default function (options?: Options): Plugin;