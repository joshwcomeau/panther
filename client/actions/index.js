import { CLICK_NODE } from '../constants';

export function clickNode(node) {
  return {
    type: CLICK_NODE,
    node: node
  };
}
