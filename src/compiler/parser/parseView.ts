import { View } from "../decl";
import { Tokenizer } from '../../token';

export function parseView(t: Tokenizer, views: View[]) {
  if (!t.skip('view')) return false
  t.readWhile((c) => c !== undefined)
  const v = null as any as View
  views.push(v)
  return true
}