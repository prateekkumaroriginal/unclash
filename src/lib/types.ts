import { Server, Member, Profile, Message } from "@prisma/client";
import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from 'socket.io';

export type serverWithMembersWithProfiles = Server & {
    members: (Member & { profile: Profile })[]
}

export type memberWithProfile = Member & {
    profile: Profile
}

export type NextApiResponseServerIO = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer;
        }
    }
}

export type messageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile
    }
}