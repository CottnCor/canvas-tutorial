/**
 * 高阶组件
 * 处理 Props 默认值
 * @param defaultProps
 * @param component
 */
function withDefaultProps<Props extends object, DefaultProps extends Partial<Props>>(defaultProps: DefaultProps, component: React.ComponentType<Props>) {
  component.defaultProps = defaultProps;
  type RequiredProps = Omit<Props, keyof DefaultProps>;
  return (component as React.ComponentType<any>) as React.ComponentType<RequiredProps & DefaultProps>;
}
export default withDefaultProps;
