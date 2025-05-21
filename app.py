from flask import Flask, render_template, request, jsonify
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/receive-url', methods=['POST'])

def receive_url():
    data = request.get_json()
    url = data.get('url')
    print(f"Received URL: {url}")   

    headers = {
        "User-Agent": "Mozilla/5.0"  # Important to avoid blocking
    }
    options = Options()
    options.headless = True  # Run in headless mode
    driver = webdriver.Chrome(options=options)
    try:
        
        driver.get(url)
        time.sleep(5)

        soup=   BeautifulSoup(driver.page_source, 'html.parser')

        results = []

        stations = soup.select('table.sortable tr')  # Adjust selector
        
        for station in stations[1:]:  # Skip header row
            cells = station.find_all('td')
            if len(cells) >= 2:  # At least name and price columns
                results.append({
                    "name": cells[0].get_text(strip=True),
                    "price": cells[1].get_text(strip=True)
                })
        
        driver.quit()
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)