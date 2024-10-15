const fs = require("fs");
const puppeteer = require("puppeteer");
const path = require("path");
const sharp = require("sharp"); // To further optimize/compress images

// List of website URLs
// const websiteUrls = [
//     "https://www.chatbot.com/",
//     "https://deepai.org/chat",
//     "https://rasa.com/",
//     "https://www.intercom.com/",
//     "https://www.liveperson.com/",
//     "https://manychat.com/",
//     "https://www.tidio.com/",
//     "https://kore.ai/",
//     "https://hellotars.com/",
//     "https://julius.ai/",
//     "https://www.tableau.com/",
//     "https://www.microsoft.com/en-us/power-platform/products/power-bi",
//     "https://www.luzmo.com/",
//     "https://www.knime.com/",
//     "https://www.databricks.com/",
//     "https://answerrocket.com/",
//     "https://www.sas.com/en_us/home.html",
//     "https://altair.com/altair-rapidminer",
//     "https://www.crayon.co/",
//     "https://www.semrush.com/",
//     "https://www.browse.ai/home",
//     "https://www.algolia.com/",
//     "https://brand24.com/",
//     "https://surveysparrow.com/",
//     "https://www.hubspot.com/",
//     "https://consensus.app/",
//     "https://pollthepeople.app/",
//     "https://seamless.ai/",
//     "https://leadzen.ai/",
//     "https://relevanceai.com/",
//     "https://www.apollo.io/",
//     "https://customers.ai/",
//     "https://leadiq.com/",
//     "https://www.jasper.ai/",
//     "https://www.copilotai.com/",
//     "https://useartemis.co/",
//     "https://www.bardeen.ai/",
//     "https://www.webharvy.com/",
//     "https://www.octoparse.com/",
//     "https://www.import.io/",
//     "https://www.parsehub.com/",
//     "https://www.diffbot.com/",
//     "https://www.scraperapi.com/",
//     "https://webscraper.io/",
//     "https://www.mozenda.com/",
//     "https://www.adcreative.ai/",
//     "https://www.adyouneed.com/",
//     "https://www.jacquard.com/",
//     "https://www.nexoya.com/campaign-optimization-ai/",
//     "https://shown.io/en",
//     "https://brightbid.com/",
//     "https://www.adspert.net/",
//     "https://sproutsocial.com/",
//     "https://www.sprinklr.com/",
//     "https://socialbee.com/",
//     "https://buffer.com/",
//     "https://www.hootsuite.com/",
//     "https://planable.io/",
//     "https://contentstudio.io/",
//     "https://www.socialpilot.co/",
//     "https://vistasocial.com/",
//     "https://www.mentionlytics.com/",
//     "https://publer.io/",
//     "https://www.lately.ai/",
//     "https://www.ocoya.com/",
//     "https://quillbot.com/",
//     "https://www.writecream.com/",
//     "https://www.craftly.ai/",
//     "https://easy-peasy.ai/",
//     "https://www.hyperwriteai.com/",
//     "https://simplified.com/ai-writer",
//     "https://www.copy.ai/",
//     "https://rytr.me/",
//     "https://writesonic.com/",
//     "https://www.anyword.com/",
//     "https://www.descript.com/",
//     "https://invideo.io/",
//     "https://www.kapwing.com/ai",
//     "https://www.synthesia.io/",
//     "https://clipchamp.com/",
//     "https://www.veed.io/",
//     "https://www.steve.ai/",
//     "https://pictory.ai/",
//     "https://www.visla.us/",

//     // Add more URLs
// ];

const websiteUrls = ["https://kore.ai/"];

// Function to sanitize the URL for use in a file name
function sanitizeUrlForFileName(url) {
    return url.replace(/[^a-zA-Z0-9]/g, "_");
}

// Function to capture and optimize a screenshot of a website
async function captureScreenshot(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        // Set viewport size to 400x300
        await page.setViewport({
            width: 1366,
            height: 768,
        });

        // Go to the website URL
        await page.goto(url, { waitUntil: "networkidle2" });

        // Ensure 'screenshots' directory exists
        const screenshotsDir = path.resolve(__dirname, "screenshots");
        fs.mkdirSync(screenshotsDir, { recursive: true });

        // Sanitize the URL and use it as the file name
        const sanitizedFileName = `${sanitizeUrlForFileName(url)}.jpeg`;
        const filePath = path.resolve(screenshotsDir, sanitizedFileName);

        // Capture screenshot with 400x300 dimensions and save as JPEG
        await page.screenshot({ path: filePath, type: "jpeg", quality: 80 });

        console.log(`Captured screenshot of: ${url} as ${sanitizedFileName}`);

        // Further optimize the image to reduce size to under 200KB if necessary
        await optimizeImage(filePath);
    } catch (error) {
        console.error(`Failed to capture ${url}:`, error.message);
    } finally {
        await browser.close();
    }
}

// Function to optimize the image using sharp to keep the size under 200KB
async function optimizeImage(filePath) {
    try {
        const { size } = fs.statSync(filePath);

        if (size > 200 * 1024) {
            await sharp(filePath)
                .jpeg({ quality: 60 }) // Adjust quality further to reduce size
                .toFile(filePath);
            console.log(`Optimized ${filePath} to reduce size below 200KB`);
        } else {
            console.log(`${filePath} is already under 200KB`);
        }
    } catch (error) {
        console.error(`Failed to optimize ${filePath}:`, error.message);
    }
}

// Function to capture screenshots for all websites in the list
async function captureAllScreenshots() {
    for (const url of websiteUrls) {
        await captureScreenshot(url);
    }
}

captureAllScreenshots();
