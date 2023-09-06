import { ActionPanel, Detail, List, Action, getPreferenceValues, showToast, Toast } from "@raycast/api";
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
  apiKey: string,
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
        'Client-ID': `${preferences.apiKey}`,

        'Authorization': `Bearer ${preferences.accessToken}`,
    }
    }

    try {
      const response = await igdb(`${preferences.apiKey}`, `Bearer ${preferences.accessToken}`, requestOptions)
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
    <List>
      <List.Item
        icon="list-icon.png"
        title="Greeting"
        actions={
          <ActionPanel>
            <Action.Push title="Show Details" target={<Detail markdown="# Hey! 👋" />} />
          </ActionPanel>
        }
      />
    </List>
  );
}
