import axios from 'axios';
import React from 'react';
import { useState, useEffect, createRef } from 'react';
import { Button, Form, Image } from 'react-bootstrap';
import { musicIcon, pauseIcon, playIcon } from '../../assets/icons';
import './styles.scss';

export default function MusicPlayer() {
  const [music, setMusic] = useState<any>(null);
  const [expand, setExpand] = useState(false);

  const [isPlaying, setIsPlaying] = useState<any>('');
  const [query, setQuery] = useState('');

  const [selectedSongIndex, setSelectedSongIndex] = useState<any>(0);
  const refs = createRef<HTMLAudioElement>();

  const songIndex =
    music &&
    music.findIndex((song: any, idx: any) => idx === selectedSongIndex);

  async function fetchResultsArray(): Promise<void> {
    if (query.length > 0) {
      try {
        const { data } = await axios.get(
          `https://striveschool-api.herokuapp.com/api/deezer/search?q=${query}`
        );
        if (data) {
          setMusic(data.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  function togglePlay(index: any) {
    if (isPlaying === index) {
      setIsPlaying('');
      refs?.current?.pause();
      return;
    }

    setIsPlaying(index);
    setSelectedSongIndex(index);
    refs?.current?.play();
    return;
  }

  useEffect(() => {
    fetchResultsArray();
  }, [query]);

  function toggle() {
    !expand ? setExpand(true) : setExpand(false);
  }

  return (
    <div id="musicPlayer">
      <div className="miniMusicPlaxer">
        <Button onClick={() => toggle()} className="musicPlayerBtn mr-2">
          <Image src={musicIcon} alt="" width="30px" />
        </Button>
        <div className="strong">Mini Music Player</div>
      </div>
      {!expand ? null : (
        <>
          <Form.Control
            type="search"
            value={query}
            className="customInput"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for songs"
          />
          <>
            <div className="mappedMusic">
              {music &&
                music.slice(0, 10).map((song: any, index: number) => (
                  <div key={song?.id} className="relative">
                    {/* <SingleSong song={song} index={index} /> */}
                    <div
                      onClick={() => togglePlay(index)}
                      className="musicInfo"
                    >
                      <div className="position-relative">
                        <Image
                          className="albumPicture"
                          roundedCircle
                          src={song?.album?.cover_medium}
                          alt=""
                          width="60px"
                          height="60px"
                        />
                      </div>
                      <div className="playStatus">
                        {isPlaying !== index ? (
                          <Image
                            roundedCircle
                            src={playIcon}
                            alt=""
                            width="30px"
                            height="30px"
                          />
                        ) : (
                          <Image
                            roundedCircle
                            src={pauseIcon}
                            alt=""
                            width="30px"
                            height="30px"
                          />
                        )}
                      </div>
                      <p className="strong">{song?.title_short}</p>
                    </div>
                  </div>
                ))}
              <audio ref={refs} src={music ? music[songIndex]?.preview : ''} />
            </div>
          </>
        </>
      )}
    </div>
  );
}
