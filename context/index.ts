import { create } from 'zustand'

export const useFlickzoStore = create<{
    recentVideos: any[];
    setRecentVideos: (videos: any[]) => void;
    removeVideo: (videoId: string) => void;
}>((set) => ({
    recentVideos: [],
    setRecentVideos: (videos) => set({ recentVideos: videos }),
    removeVideo: (videoId) => set((state) => ({
        recentVideos: state.recentVideos.filter((v: any) => v.id !== videoId)
    })),
}))