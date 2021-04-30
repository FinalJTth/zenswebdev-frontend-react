const headers = {
  accept: 'application/json',
  'accept-language': 'en-US,en;q=0.9,th;q=0.8',
  'content-type': 'application/json',
  'if-none-match-': '55b03-f768e18162be5cb875763e3392f2ea95',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'x-api-source': 'pc',
  'x-csrftoken': '9rhdj5zzC1LwACkmDdf7TGXIxR3S9VOD',
  'x-requested-with': 'XMLHttpRequest',
  'x-shopee-language': 'th',
};

export async function placeOrder() {
  return 'test';
}

export async function checkout(shopId, itemId, modelId = undefined) {
  const res = await fetch('https://shopee.co.th/api/v4/cart/checkout', {
    headers,
    origin: 'https://shopee.co.th',
    referrer: 'https://shopee.co.th/cart/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: JSON.stringify({
      selected_shop_order_ids: [
        {
          shopid: shopId,
          item_briefs: [
            {
              itemid: itemId,
              modelid: modelId,
              item_group_id: null,
              offerid: null,
              price: 399200000,
              quantity: 1,
              is_add_on_sub_item: null,
              add_on_deal_id: null,
              status: 1,
              cart_item_change_time: 1618392850,
            },
          ],
          shop_vouchers: {},
        },
      ],
      platform_vouchers: {},
    }),
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  });
  return res;
}

export async function selectOnCart(shopId, itemId, modelId = undefined) {
  const res = await fetch('https://shopee.co.th/api/v4/cart/update', {
    headers,
    referrer: 'https://shopee.co.th/cart/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: JSON.stringify({
      action_type: 0,
      updated_shop_order_ids: {},
      selected_shop_order_ids: [
        {
          shopid: shopId,
          item_briefs: [
            {
              itemid: itemId,
              modelid: modelId,
              item_group_id: null,
              offerid: null,
              price: 399200000, // 49500000,
              quantity: 1,
              is_add_on_sub_item: null,
              add_on_deal_id: null,
              status: 1,
              cart_item_change_time: 1602433091,
            },
          ],
          addin_time: 1602433091,
          auto_apply: true,
          shop_vouchers: {},
        },
      ],
      promotion_data: {
        use_coins: false,
        platform_vouchers: {},
        free_shipping_voucher_info: {
          free_shipping_voucher_id: 0,
        },
      },
    }),
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  });
  return res;
}

export async function addToCart(shopId, itemId, modelId) {
  const res = await fetch('https://shopee.co.th/api/v2/cart/add_to_cart', {
    headers,
    origin: 'https://shopee.co.th',
    referrer:
      'https://shopee.co.th/PetVac365-%E0%B8%AB%E0%B8%B8%E0%B9%88%E0%B8%99%E0%B8%A2%E0%B8%99%E0%B8%95%E0%B9%8C%E0%B8%94%E0%B8%B9%E0%B8%94%E0%B8%9D%E0%B8%B8%E0%B9%88%E0%B8%99-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%96%E0%B8%B9%E0%B8%9E%E0%B8%B7%E0%B9%89%E0%B8%99%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B9%81%E0%B8%97%E0%B9%87%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B8%99%E0%B9%89%E0%B8%B3-Wifi-GYRO-MAPPING-VIRTUAL-WALL-i.12166643.1102559578',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: JSON.stringify({
      quantity: 1,
      checkout: true,
      update_checkout_only: false,
      donot_add_quantity: false,
      source: '{"refer_urls":[]}',
      client_source: 1,
      shopid: shopId,
      itemid: itemId,
      modelid: modelId,
    }),
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  });
  return res;
}
// addToChart("55b03-7282e688569e4e3b7d298624ad9c1107", 28710029, 7755087589, 41223283528);
const shopId = 12166643;
const itemId = 1102559578;
const modelId = 43473932701;
/*
addToChart(shopId, itemId, modelId)
  .then((data) => {
    console.log(`successful add ${itemId} to chart`);
    console.log(`payload :`, data);
    if (data.error === 0) {
      console.log(`successful add ${itemId} to chart`);
      /*
    checkout(shopId, itemId, modelId).then((data) => {
      console.log(data);
    })
    */
/*
    }
  })
  .catch((err) => {
    console.log('cannot add item to cart :', err);
  });
*/
