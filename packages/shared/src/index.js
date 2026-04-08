/**
 * 共享工具与类型入口；各 app 通过 workspace 依赖引用。
 * @param {string} name
 * @returns {string}
 */
export function greet(name) {
  return `Hello, ${name}`;
}
