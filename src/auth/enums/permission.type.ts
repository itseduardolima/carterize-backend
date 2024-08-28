import { ProfileValue } from 'src/common/utils/Enum';

let AccessProfile = {
  ADMIN: ProfileValue.ADMIN_VALUE,
  CLIENT: ProfileValue.CLIENT_VALUE,

  ALL: [ProfileValue.ADMIN_VALUE, ProfileValue.CLIENT_VALUE],
};
export default AccessProfile;
