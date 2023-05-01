import { Injectable } from "@nestjs/common";
import { EnqueueStrategy, PlaywrightCrawler, downloadListOfUrls } from 'crawlee';

@Injectable()
export class AppService {
  getData(): { message: string; } {
    return { message: "Hello API" };
  }

  public async demoCrawl() {
    const crawler = new PlaywrightCrawler({
      // Function called for each URL
      async requestHandler({ request, enqueueLinks, log }) {
        log.info(request.url);
        // Add some links from page to the crawler's RequestQueue
        await enqueueLinks({
          strategy: EnqueueStrategy.SameDomain,
        });
      },
      maxRequestsPerCrawl: 40, // Limitation for only 10 requests (do not use if you want to crawl a sitemap)
    });

    const listOfUrls = await downloadListOfUrls({ url: 'https://ted.europa.eu/TED/rss/de/RSS_comp_AUT.xml', urlRegExp: RegExp('https://ted.europa\.eu/udl\?uri=TED:NOTICE.*') });

    await crawler.addRequests(listOfUrls);

    // Run the crawler
    await crawler.run();
  }
}
