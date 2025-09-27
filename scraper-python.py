import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
def scrape():
    # url = 'https://www.traderjoes.com/home/products/pdp/074953'
    # headers = {
    #             'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
    #             }
    # response = requests.get(url, headers=headers)
    # print(response.status_code)
    # print(response.url)
    # soup = BeautifulSoup(response.text, 'html.parser')
    chrome_options = Options()

    chrome_options.add_experimental_option("detach", True)
    cService = webdriver.ChromeService(executable_path='/Users/brianhe/Desktop/chromedriver')
    driver = webdriver.Chrome(service = cService, options=chrome_options)
    print("Entering Page")
    driver.get('https://www.traderjoes.com/home/products/category/products-2')
    time.sleep(3)
    res = []
    i = 0
    while i < 5:  
        WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, '.ProductCard_card__title__text__uiWLe a'))
        )
        print("Parsing Page: ", i)
        page_source = BeautifulSoup(driver.page_source, 'html.parser')
        items = page_source.select('[class="ProductCard_card__title__text__uiWLe"] a ')
        print("Amount of items on page ",i,': ', len(items) )
        prices = page_source.select('[class="ProductPrice_productPrice__price__3-50j"]')
        for x, y in zip(items, prices):
            res.append([x.text, y.text])
        # go to next page
        next_button = driver.find_element(By.CSS_SELECTOR, '[class="Pagination_pagination__arrow__3TJf0 Pagination_pagination__arrow_side_right__9YUGr"]')
        if i == 0:
            time.sleep(5)
            print('Waiting for popup')
            popup_button = driver.find_element(By.CSS_SELECTOR, '[class="needsclick klaviyo-close-form go2324193863 kl-private-reset-css-Xuajs1"]')
            popup_button.click()
            time.sleep(2)
            cookies_button = driver.find_element(By.CSS_SELECTOR, '[class="Button_button__3Me73 Button_button_variant_secondary__RwIii"]')
            cookies_button.click()
            time.sleep(2)
        next_button.click()
        i += 1
    driver.quit()
    print(res)
    
if __name__ == '__main__':
    scrape()