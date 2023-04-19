const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userId: state => state.user.userId,
  menus: state => state.user.menus, // 菜单权限
  roles: state => state.user.roles // 角色权限控制按钮
}
export default getters
