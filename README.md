# OCPP 1.6 client for browsers

This is a modified version of [`ocpp-ts`](https://github.com/sepych/ocpp-ts) focused on working in the browser.

## Installation
```
npm install --save-dev browser-ocpp-client
```

## Usage

```ts
import {
  BootNotificationRequest,
  BootNotificationResponse,
  OcppBrowserClient, OcppError,
} from 'browser-ocpp-client';

const chargingPointSimple = new OcppClient('CP1111');
chargingPointSimple.on('error', (err: Error) => {
  console.log(err.message);
});
chargingPointSimple.on('close', () => {
  console.log('Connection closed');
});

chargingPointSimple.on('connect', async () => {
  const boot: BootNotificationRequest = {
    chargePointVendor: 'eParking',
    chargePointModel: 'NECU-T2',
  };

  try {
    const bootResp: BootNotificationResponse = await chargingPointSimple.callRequest('BootNotification', boot);
    if (bootResp.status === 'Accepted') {
      console.log('Bootnotification accepted');
    }
  } catch (e) {
    if (e instanceof Error || e instanceof OcppError) {
      console.error(e.message);
    }
  }
});
chargingPointSimple.connect('ws://localhost:9220/');
```
