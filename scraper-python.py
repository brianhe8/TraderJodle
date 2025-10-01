import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import csv
def scrape():
    chrome_options = Options()

    chrome_options.add_experimental_option("detach", True)
    cService = webdriver.ChromeService(executable_path='/Users/brianhe/Desktop/chromedriver')
    driver = webdriver.Chrome(service = cService, options=chrome_options)
    print("Entering Page")
    
    driver.get('https://www.traderjoes.com/home/products/category/products-2')
    time.sleep(3)
    driver.refresh()
    res = []
    WebDriverWait(driver, 15).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, '.ProductCard_card__title__text__uiWLe a'))
        )
    page_source = BeautifulSoup(driver.page_source, 'html.parser')
    last_page = page_source.select_one('[class="PaginationItem_paginationItem__2f87h Pagination_pagination__lastItem__3eYWw Pagination_pagination__lastItem_shown__mExTm Pagination_pagination__lastItem_shownMobile__3xfjl Pagination_pagination__lastItem_pagesSkipped__1wdCc Pagination_pagination__lastItem_pagesSkippedMobile__2K1Fx"]')
    lastPageNum = int(last_page.get_text(strip=True)[4:])
    print(lastPageNum)
    i = 1
    while i <= lastPageNum:   # 106 total pages # change to while there is a button to press
        WebDriverWait(driver, 15).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, '.ProductCard_card__title__text__uiWLe a'))
        )
        print("Parsing Page: ", i)
        page_source = BeautifulSoup(driver.page_source, 'html.parser')
        items = page_source.select('[class="ProductCard_card__title__text__uiWLe"] a ')
        print("Amount of items on page ",i,': ', len(items) )
        prices = page_source.select('[class="ProductPrice_productPrice__price__3-50j"]')
        images = page_source.select('[class="ProductCard_card__cover__19-g3"]')
        for item, price, image in zip(items, prices, images):
            img = image.get("srcoriginal")
            imgURL = 'https://www.traderjoes.com' + img
            res.append([item.text, price.text[1:], imgURL])
        # go to next page
        if i == lastPageNum:
            print("Reached Last Page. Dont need to go to next page.")
            break
        WebDriverWait(driver, 15).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, '[class="Pagination_pagination__arrow__3TJf0 Pagination_pagination__arrow_side_right__9YUGr"]'))
        )
        if i == 1:
            time.sleep(5)
            print('Waiting for popup')
            popup_button = driver.find_element(By.CSS_SELECTOR, '[class="needsclick klaviyo-close-form go2324193863 kl-private-reset-css-Xuajs1"]')
            popup_button.click()
            time.sleep(2)
            cookies_button = driver.find_element(By.CSS_SELECTOR, '[class="Button_button__3Me73 Button_button_variant_secondary__RwIii"]')
            cookies_button.click()
            time.sleep(2)
        next_button = driver.find_element(By.CSS_SELECTOR, '[class="Pagination_pagination__arrow__3TJf0 Pagination_pagination__arrow_side_right__9YUGr"]')
        next_button.click()
        i += 1
    driver.quit()
    with open("products.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        
        writer.writerow(["item_name", "item_price", "item_image"])
        
        writer.writerows(res)
    print("CSV file written successfully.")
if __name__ == '__main__':
    scrape()