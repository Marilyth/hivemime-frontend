import { observer } from "mobx-react-lite";
import { PostDto } from "@/lib/Api";
import { VoteQuery, VoteQueryGroup } from "@/lib/query-builder";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";
import { HiveMimeVoteQueryGroup } from "./hm-vote-query-group";
import { HiveMimeFilterConditionCreator } from "./hm-condition-creator";
import { HiveMimeBulletItem } from "@/components/custom/utility/hm-bullet-item";
import { LayoutGroup } from "framer-motion";


interface HiveMimePostResultFilterProps {
    post: PostDto;
    builder: VoteQueryGroup;
    isOpen: boolean;
    onFinished: () => void;
}

export const HiveMimePostResultFilter = observer(({ post, builder, isOpen, onFinished }: HiveMimePostResultFilterProps) => {
    const [showCreator, setShowCreator] = useState(false);

    function handleFinished(newQuery: VoteQuery | null) {
        if (newQuery) {
            builder.children.push(newQuery);
        }

        setShowCreator(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onFinished}>
            <DialogContent>
                {showCreator ?
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold">
                            Create condition
                        </span>

                        <HiveMimeFilterConditionCreator post={post} onFinished={handleFinished} />
                    </div> :
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold">
                            Filter votes
                        </span>

                        <span className="text-sm text-muted-foreground mb-4">
                            Add conditions to filter out votes you don&apos;t want to see.
                        </span>

                        <LayoutGroup>
                            {builder.children.length > 0 &&
                                <div className="bg-muted/30 border rounded mb-2">
                                    <HiveMimeVoteQueryGroup group={builder} isFirstItem={true} isRoot={true} />
                                </div>
                            }
                        </LayoutGroup>

                        {builder.children.length > 1 &&
                            <HiveMimeBulletItem className="mb-2">
                                <span className="text-muted-foreground text-sm">You can <span className="text-honey-brown">drag & drop</span> your conditions to re-order and group them up.</span>
                            </HiveMimeBulletItem>
                        }

                        <Button variant="outline" onClick={() => setShowCreator(true)}>
                            <Plus />
                            Add condition
                        </Button>
                    </div>
                }
            </DialogContent>
        </Dialog>
    );
});
