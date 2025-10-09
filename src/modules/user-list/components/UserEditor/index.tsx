import { Pencil } from 'lucide-react';
import type { FC } from 'react';
import type { UserEntity } from '../../services/userType';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { roleMap } from '@/services/role/roleEnums';

type Props = {
    userInfo: UserEntity;
};

const UserEditor: FC<Props> = ({ userInfo }) => {
    const { name, email, roles, isActive } = userInfo;
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="ghost"><Pencil /></Button>
            </SheetTrigger>
            <SheetContent aria-describedby="">
                <SheetHeader>
                    <SheetTitle>Edit User</SheetTitle>
                </SheetHeader>
                <div className="grid flex-1 auto-rows-min gap-6 px-4">
                    <div className="flex justify-between gap-3">
                        <Label>Name</Label>
                        <Label className="font-normal">{name}</Label>
                    </div>
                    <div className="flex justify-between gap-3">
                        <Label>Email</Label>
                        <Label className="font-normal">{email}</Label>
                    </div>
                    <div className="grid gap-3">
                        <Label>Role</Label>
                        {
                            Object.entries(roleMap).map(([key, role]) => {
                                return (
                                    <Label key={key} className="flex items-center gap-2">
                                        <Checkbox defaultChecked={roles.includes(key)} />
                                        {role.label}
                                    </Label>
                                );
                            })
                        }
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <Label>Enabled</Label>
                        <Switch defaultChecked={isActive} />
                    </div>
                </div>
                <SheetFooter>
                    <Button type="submit">Save changes</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export { UserEditor };
