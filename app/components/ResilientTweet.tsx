import { EmbeddedTweet } from "react-tweet";
import { getTweet, type Tweet, type TweetBase } from "react-tweet/api";

function normalizeEntities<T extends TweetBase>(tweet: T): T {
  return {
    ...tweet,
    // The syndication API omits empty entity arrays; react-tweet iterates them.
    entities: {
      ...tweet.entities,
      hashtags: tweet.entities.hashtags ?? [],
      user_mentions: tweet.entities.user_mentions ?? [],
      urls: tweet.entities.urls ?? [],
      symbols: tweet.entities.symbols ?? [],
    },
  };
}

export async function ResilientTweet({ id }: { id: string }) {
  const tweet = await getTweet(id).catch(() => undefined);
  if (!tweet) {
    return <a href={`https://x.com/i/status/${id}`}>View the original post on X</a>;
  }
  const normalized: Tweet = {
    ...normalizeEntities(tweet),
    ...(tweet.quoted_tweet
      ? { quoted_tweet: normalizeEntities(tweet.quoted_tweet) }
      : {}),
  };
  return <EmbeddedTweet tweet={normalized} />;
}
