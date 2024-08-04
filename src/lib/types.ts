import { Server, Member, Profile } from "@prisma/client";

export type serverWithMembersWithProfiles = Server & {
    members: (Member & { profile: Profile })[]
}

export type memberWithProfile = Member & {
    profile: Profile
}