/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    // Check if the user is a SuperAdmin
    canSuperAdmin: currentUser?.roles.includes('SuperAdmin') ?? false,

    // Check if the user is an Admin or higher (SuperAdmin also has Admin access)
    canAdmin: currentUser?.roles.some((role) => ['SuperAdmin', 'Admin'].includes(role)) ?? false,

    // Check if the user is a Moderator or higher (includes SuperAdmin and Admin)
    canModerator:
      currentUser?.roles.some((role) => ['SuperAdmin', 'Admin', 'Moderator'].includes(role)) ??
      false,

    // Check if the user is a Basic user
    canUser: currentUser?.roles.includes('Basic') ?? false,
  };
}
