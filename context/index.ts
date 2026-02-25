import { create } from 'zustand'

export const useFlickzoStore = create<{
    recentVideos: { id: string; title: string; status: string; [key: string]: unknown }[];
    setRecentVideos: (videos: { id: string; title: string; status: string; [key: string]: unknown }[]) => void;
    removeVideo: (videoId: string) => void;
}>((set) => ({
    recentVideos: [],
    setRecentVideos: (videos) => set({ recentVideos: videos }),
    removeVideo: (videoId) => set((state) => ({
        recentVideos: state.recentVideos.filter((v) => v.id !== videoId)
    })),
}))