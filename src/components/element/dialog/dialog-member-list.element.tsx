import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
    X,
    Users,
    User,
    Shield,
    Mail,
    UserPlus,
    Crown
} from 'lucide-react'
import { FundMemberDto } from '@/apis/funds/fund.interface'
import { Fund } from '@/apis/funds/fund.entities'

interface FundMemberListDialogProps {
    isOpen: boolean
    onClose: () => void
    fund: Fund
    members: FundMemberDto[]
    isLoading: boolean
    onRefresh: () => void
    onInviteMember?: () => void
    onRemoveMember?: (memberId: string) => void
    currentUserId?: string
}

export function FundMemberListDialog({
    isOpen,
    onClose,
    fund,
    members = [],
    isLoading = false,
    onInviteMember,
    onRemoveMember,
    currentUserId
}: FundMemberListDialogProps) {
    const [search, setSearch] = React.useState('');
    const filteredMembers = React.useMemo(() => {
        if (!search.trim()) return members;
        const lower = search.trim().toLowerCase();
        return members.filter(m => {
            const user = m.user;
            return (
                (user && user.name && user.name.toLowerCase().includes(lower)) ||
                (user && user.email && user.email.toLowerCase().includes(lower)) ||
                (m.userId && m.userId.toLowerCase().includes(lower))
            );
        });
    }, [members, search]);


    const getRoleDisplay = (role: string) => {
        const roleMap: Record<string, {
            label: string;
            variant: "default" | "secondary" | "destructive" | "outline";
            icon?: React.ReactNode;
        }> = {
            owner: {
                label: 'Chủ quỹ',
                variant: 'default',
                icon: <Crown className="h-3 w-3 mr-1" />
            },
            member: {
                label: 'Thành viên',
                variant: 'outline',
                icon: <User className="h-3 w-3 mr-1" />
            }
        }
        return roleMap[role] || roleMap.member
    }

    const handleRemoveMember = (e: React.MouseEvent, memberId: string) => {
        e.stopPropagation()
        if (onRemoveMember && window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
            onRemoveMember(memberId)
        }
    }

    const getUserInfo = (member: FundMemberDto) => {
        if (member.user) {
            return {
                id: member.user.id,
                name: member.user.name,
                email: member.user.email,
                avatar: undefined
            }
        }

        return {
            id: member.userId,
            name: `User ${member.userId.substring(0, 8)}`,
            email: `user-${member.userId.substring(0, 8)}@example.com`,
            avatar: undefined
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] w-[98vw] max-h-[90vh] p-0 overflow-hidden">
                <DialogHeader className="px-7 pt-7 pb-3 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <DialogTitle className="text-xl font-semibold flex items-center gap-2 text-black">
                                <Users className="h-5 w-5 text-gray-600" />
                                Thành viên quỹ
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-base text-left">
                                {fund?.name} • {fund?.type === 'shared' ? 'Quỹ chung' : 'Quỹ cá nhân'}
                            </DialogDescription>
                        </div>

                    </div>
                </DialogHeader>

                <div className="px-7 py-4 border-b bg-gray-50/50 flex items-center justify-between gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Tìm kiếm thành viên theo tên, email..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm text-black bg-white"
                    />
                    {fund?.type === 'shared' && onInviteMember && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onInviteMember}
                            className="h-9 gap-1.5 ml-2 whitespace-nowrap"
                        >
                            <UserPlus className="h-4 w-4" />
                            Mời
                        </Button>
                    )}
                </div>

                <ScrollArea className="flex-1 px-7 py-4 min-h-[30vh] h-auto">
                    {isLoading ? (
                        <div className="space-y-3 py-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
                                    <Skeleton className="h-9 w-9 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-3.5 w-32" />
                                        <Skeleton className="h-2.5 w-24" />
                                    </div>
                                    <Skeleton className="h-5 w-14 rounded-full" />
                                </div>
                            ))}
                        </div>
                    ) : filteredMembers.length === 0 ? (
                        <div className="text-center py-8">
                            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="font-medium text-gray-600 mb-2">Không tìm thấy thành viên</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                {search.trim()
                                    ? 'Không có thành viên nào phù hợp với từ khóa.'
                                    : fund?.type === 'shared'
                                        ? 'Mời thành viên tham gia quỹ chung'
                                        : 'Quỹ cá nhân chỉ có bạn'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2 py-1">
                            {filteredMembers.map((member) => {
                                const roleInfo = getRoleDisplay(member.role)
                                const userInfo = getUserInfo(member)
                                const isCurrentUser = userInfo.id === currentUserId

                                return (
                                    <div
                                        key={member.id}
                                        className={`flex max-sm:flex-col sm:items-center gap-3 p-3 rounded-lg ${isCurrentUser ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                    >
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback className={
                                                member.role === 'owner'
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-gray-100 text-gray-600'
                                            }>
                                                {userInfo.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm truncate text-black">
                                                    {userInfo.name}
                                                    {isCurrentUser && (
                                                        <span className="ml-1.5 text-xs text-blue-600">(Bạn)</span>
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <Mail className="h-3 w-3 text-gray-400" />
                                                <span className="text-xs text-gray-500 truncate">
                                                    {userInfo.email}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={roleInfo.variant}
                                                className="text-xs px-2 py-0.5"
                                            >
                                                {roleInfo.icon}
                                                {roleInfo.label}
                                            </Badge>
                                            {fund?.type === 'shared' &&
                                                member.role !== 'owner' &&
                                                onRemoveMember && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={(e) => handleRemoveMember(e, member.id)}
                                                        className="h-7 w-7 text-gray-400 hover:text-red-500"
                                                        title="Xóa thành viên"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </ScrollArea>

                {fund?.type === 'shared' && members.length > 0 && (
                    <div className="px-7 py-4 border-t text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <Shield className="h-3 w-3 text-sm text-blue-500" />
                            <span>Chủ quỹ có thể quản lý thành viên</span>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}