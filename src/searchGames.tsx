import { ActionPanel, List, Action, getPreferenceValues, showToast, Toast } from "@raycast/api";
import { useState } from "react";

interface GameItem {
  id: number,
  name: string,
  cover: Cover,
  url: string,
  summary: string,
  total_rating: number,
  release_dates: Release_Dates[],
  category: number,
}

interface Release_Dates {
  human: string
}
interface Cover {
  image_id: string
}

interface Preferences {
  clientID: string,
  accessToken: string,
}

export default function Command() {

  const igdb = require("igdb-api-node").default;

  const [game, setGame] = useState<GameItem[] | null>();
  const [query, setQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const preferences = getPreferenceValues<Preferences>();
  
  const fetchGames = async (query: string) => {
    if (query === "") {
      setGame(null);
      setIsLoading(false)
      return;
    }

    setIsLoading(true);
    const requestOptions = {
      method: "post",
      baseURL: "https://api.igdb.com/v4",
      responseType: 'json',

      headers: {
        'Accept': 'application/json',
        'Client-ID': `${preferences.clientID}`,

        'Authorization': `Bearer ${preferences.accessToken}`,
    }
    }

    try {
      const response = await igdb(`${preferences.clientID}`, `Bearer ${preferences.accessToken}`, requestOptions)
      .fields(['name', 'cover.image_id', 'url', 'summary', 'total_rating', 'release_dates.human', 'category'])
      .search(query)
      .limit(10)
      .request('games')
      const res = await response.data
      const resParse = JSON.parse(JSON.stringify(res))
      setGame(resParse);
      setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        showToast({ style: Toast.Style.Failure, title: "Something went wrong", message: `${error}` });
      }
  }

  return (
    <List  
    isShowingDetail={!isLoading && (game !== null)} 
      isLoading={isLoading}
      onSearchTextChange={(query: string) => {
        setQuery(query);
        fetchGames(query);
      }} throttle>
      {game && !isLoading && (
            
            game.map((gameItem:GameItem) => (
                
                <List.Item
                    key={gameItem.id}
                    title={gameItem.name}

                    icon={gameItem.cover?.image_id ? `https://images.igdb.com/igdb/image/upload/t_cover_small/${gameItem.cover.image_id}.jpg`: "game-icon.png"}
                    detail={
                      <List.Item.Detail
                        markdown={`![Game Banner](https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${gameItem.cover?.image_id}.jpg)
                        ${gameItem.summary ?? ""}
                        `}
                        metadata={
                          <List.Item.Detail.Metadata>
                            <List.Item.Detail.Metadata.Label title="IGDB ID" text={gameItem.id.toString() ?? "Unknown"} />

                            <List.Item.Detail.Metadata.Label title="Title" text={gameItem.name ?? "Unknown"} />
                            <List.Item.Detail.Metadata.Label title="Rating" text={`${Math.round(gameItem.total_rating).toString() == "NaN" ? `N/A` : `${Math.round(gameItem.total_rating).toString()}/100`}`} />
                            <List.Item.Detail.Metadata.Label title="Release Date" text={`${undefined == gameItem.release_dates ? `N/A` : gameItem.release_dates[0].human}`} />
                                                        
                            <List.Item.Detail.Metadata.Separator />
                          </List.Item.Detail.Metadata>
                        }
                      />
                    }
                    actions={
                        <ActionPanel>                
                            <Action.OpenInBrowser title="Open in IGDB" url={gameItem.url}/>
                        </ActionPanel>
                    }
                    
                />
            ))
        )}

    </List>
  );
}
