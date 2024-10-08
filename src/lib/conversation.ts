import db from "./db"

export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        let conversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId);

        if (!conversation) {
            conversation = await createNewConversation(memberOneId, memberTwoId);
        }

        return conversation;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.findUnique({
            where: {
                memberOneId_memberTwoId: {
                    memberOneId,
                    memberTwoId
                }
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        });
    } catch (error) {
        console.log(error);
        return null;
    }
}

const createNewConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.create({
            data: {
                memberOneId,
                memberTwoId
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        });
    } catch (error) {
        console.log(error);
        return null;
    }
}