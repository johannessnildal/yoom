import { tokenProvider } from '@/actions/stream.action';
import Loader from '@/components/Loader';
import { useUser } from '@clerk/nextjs';
import {
  StreamVideoClient,
  StreamVideo,
} from '@stream-io/video-react-sdk';
import { ReactNode, useEffect, useState } from 'react';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {

  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { user, isLoaded } = useUser();

  useEffect (() => {
    if(!isLoaded || !user ) return;
    if(!apiKey) throw new Error('API key is missing');

    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user?.id,
        name: user?.username || user?.id || 'Anonymous',
        image: user?.imageUrl || 'https://getstream.io/random_svg/?name=Anonymous',
      },
      tokenProvider,
    })

    setVideoClient(client);
  }, [user, isLoaded]);

  if(!videoClient) return <Loader />;

  return (
    <StreamVideo client={videoClient}>

    </StreamVideo>
  );
};

export default StreamVideoProvider;