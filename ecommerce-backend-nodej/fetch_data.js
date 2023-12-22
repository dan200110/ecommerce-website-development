import fetch from 'node-fetch'
import fs from 'fs'

const baseUrl =
  'https://admin.karte.io/api/event-setting/view/getEventLogsAndCount?project=624bf89ac209b50019e51c4e'

async function fetchDataForEvent (event_name) {
  // Specify your date range
  const startDate = new Date('2023-11-07')
  const endDate = new Date('2023-11-30')

  const result = []

  // Make requests for each date in the range
  for (
    let currentDate = startDate;
    currentDate <= endDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    // Format the date to match the expected format
    const formattedDate = currentDate.toISOString().split('T')[0]

    const requestBody = {
      event_name: event_name,
      start_date: `${formattedDate}T00:00:00.000Z`,
      end_date: `${formattedDate}T23:59:59.999Z`,
      search_word: null,
      segments: [],
      limit: 20,
      offset: 0
    }

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        'sec-ch-ua':
          '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-datadog-origin': 'rum',
        'x-datadog-parent-id': '6110736417002054150',
        'x-datadog-sampling-priority': '1',
        'x-datadog-trace-id': '7891291798686994186',
        cookie:
          'krt.vis=HBZDicUsoQ6H8rA; krt.__ktid=pVCPLqmdUsvz1g2; krt.__ktid=pVCPLqmdUsvz1g2; krt_current_project_id.6348e6f8b43fb60013a7f576=624bf89ac209b50019e51c4e; rt_user_id=4477239542d9444f8cfb2fed5dd94093; rt_storage_writable=true; krt_rewrite_uid=4894d523-98e1-4a9a-a621-7a56e2395620; krtssid=s%3An53OMlu2I7YdACmdq4ojuOlcQNpGl0kP.jlHdqwpsMpr%2FCmritguIfTrZE41rvslFWtwlEUJDr00; WAPID=NeCK8KLygTlcWG5D2OHOLzgCnYIpkf5PAwm; wap_last_event=showWidgetPage; wovn_uuid=zaxmdpq3n; _gid=GA1.2.102831860.1703126879; _gcl_au=1.1.1568727223.1703126883; _yjsu_yjad=1703126887.0dab2c4d-f109-4e74-8f58-8e52ce964ec5; _fbp=fb.1.1703126892529.2026741224; _clck=kehaxz%7C2%7Cfhq%7C0%7C1450; wovn_selected_lang=en; _uetsid=5e91c5809fab11eea0945f2a3251bc31; _uetvid=5e91ceb09fab11eeadee35633fa5711e; _clsk=8tlhw2%7C1703140237334%7C1%7C1%7Cw.clarity.ms%2Fcollect; _ga_B79JNRMC1H=GS1.2.1703151835.4.0.1703151835.60.0.0; _ga=GA1.1.738348378.1702604738; _ga_9PNREH7N50=GS1.1.1703213279.27.0.1703213279.60.0.0; rt_session_id=2fbd3a6770134faf9d5d771dcc848947; _dd_s=rum=2&id=e67b7ca8-70ab-4fe5-b597-3d5d70993ac3&created=1703213279314&expire=1703214335210; wcl_proc=a%3D15816%26b%3D10%26c%3D1703213435356; krt-lv-ss=2fade24b-d2c8-4dd4-ad41-4808d104de92_1703213280701_1703213435359_1',
        Referer:
          'https://admin.karte.io/p/624bf89ac209b50019e51c4e/event_settings/each/insurance_20230719_view',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      },
      body: JSON.stringify(requestBody)
    })

    if (response.ok) {
      const data = await response.json()
      console.log(
        `Event: ${event_name}, Date: ${formattedDate}, Count: ${data.count}`
      )
      result.push({ date: formattedDate, count: data.count })
    } else {
      console.error(`Failed to fetch data for date ${formattedDate}`)
    }
  }

  return result
}

async function main () {
  const left_arr = [
    'abema_abema_20231108_view',
  ]

  const arr_uniq = [
    'music_music_20231108_view',
    'ogaland_oga_20231108_view',
    'music_music_20231108_updated_view',
    'insurance_articleketsuatsu_20231115_view',
    'insurance_campaign_20231115_view',
    'pointgallery_nokatsu_20231115_view',
    'rakutenbrowser_7777cpn_20231115_view',
    'check_internal_20231122_view',
    'hoken_stg_20230908_view',
    'insurance_wellsmile_20231125_view',
    'music_music_20231122_view',
    'pointgallery_nokatsu_20231122_view',
    'pointgallery_shizenshoken_20231122_view',
    'rakutenbrowser_chuusenkai_20231129_view',
    'cicibella_coupon_20231201_view',
    'frandelingerie_coupon_20231201_view'
  ]
  const resultsByEvent = {}

  for (const event_name of arr_uniq) {
    const result = await fetchDataForEvent(event_name)
    resultsByEvent[event_name] = result
  }

  // Log the results
  console.log(resultsByEvent)

  // Write results to a JSON file
  const outputFilePath = 'results.json'
  fs.writeFileSync(outputFilePath, JSON.stringify(resultsByEvent, null, 2))

  console.log(`Results have been written to: ${outputFilePath}`)
}

// Call the main function
main()
