import { create } from 'zustand';
import type { RoleInfo } from '../role/roleEnums';
import { RoleEnums, roleMap } from '../role/roleEnums';

type UserInfo = {
    id: string;
    email: string;
    username: string;
    shortName: string;
    roles: RoleInfo[];
};

type State = {
    userInfo: UserInfo;
    updateUserInfo: (userInfo: UserInfo) => void;
};

const useUserInfo = create<State>((set) => ({
    userInfo: {
        id: '',
        email: 'Arm.Strong@nike.com',
        username: 'Arm Strong',
        shortName: 'AS',
        roles: [roleMap[RoleEnums.ADMINISTRATOR]],
    },
    updateUserInfo: (userInfo: UserInfo) => set({ userInfo }),
}));

export { useUserInfo };
