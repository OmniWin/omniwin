import React from 'react';
import {classNames, tiers} from '@/app/utils';
import {Progress} from '@/components/ui/progress';
import CustomImageWithFallback from '@/app/components/CustomImageWithFallback';

interface UserProgressProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
    // experienceLeft: number;
}

const UserProgress = React.forwardRef<HTMLDivElement, UserProgressProps>(({ ...props}) => {
    return (
        <div className="space-y-3 mt-4" {...props}>
            <div className="flex items-center justify-between">
                <div
                    className={classNames("flex items-center text-xs gap-1 py-1.5 px-2.5 rounded")}
                    style={{ backgroundColor: tiers[1].lowOpacityColor, color: tiers[1].color, borderColor: tiers[1].color }}
                >
                    <CustomImageWithFallback src="/images/tier/2.png" alt="" containerClass="!w-auto" className="object-cover inset-0 !w-auto !max-h-[16px]" width={60} height={60} />
                    <span>Tier 2</span>
                </div>
                <p className="text-zinc-400 text-sm">2500 left</p>
                <div
                    className={classNames("flex items-center text-xs gap-1 py-1.5 px-2.5 rounded")}
                    style={{ backgroundColor: tiers[0].lowOpacityColor, color: tiers[0].color, borderColor: tiers[0].color }}
                >
                    <CustomImageWithFallback src="/images/tier/1.png" alt="" containerClass="!w-auto" className="object-cover inset-0 !w-auto !max-h-[16px]" width={60} height={60} />
                    <span>Tier 1</span>
                </div>
            </div>
            <Progress value={20} className="h-2" />
        </div>
    );
});

export default UserProgress;
