<template>
  <div id="qr">
    <label class="label">{{ $t('scanQrCodeLabel') }}</label>
    <div class="control">
      <qrcode-capture ref="qrCapture" style="display: none" @detect="onDetect"/>
      <button class="button is-large"
        :class="{'is-loading': isLoading, 'is-info': isLoading, 'is-success': !isLoading}"
        :disabled="isLoading"
        @click="openModal = true; isLoading = true">
        {{ $t('scanQrCode') }}
      </button>
    </div>
    
    <p class="help is-danger" :class="{'is-hidden': qrError === ''}"><i class="fas fa-exclamation-triangle"></i> {{qrError}}</p>
    
    <div v-if="openModal" class="modal is-active">
      <div class="modal-background" @click="closeModal"></div>
      <div class="modal-content">
        <div class="box has-text-centered">
          <button class="delete is-pulled-right" aria-label="close" @click="closeModal"></button>
          <h6 class="title is-5">{{ $t('scanQrCode') }}</h6>
          <h6 class="subtitle is-7">{{ $t('scanQrCodeHelpMessage') }}</h6>
          <div class="content">
            <LoadingIndicator v-if="isLoading" />
            <qrcode-stream @detect="onDetect" @init="onInit" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { QrcodeCapture, QrcodeStream } from 'vue-qrcode-reader';

import LoadingIndicator from '@/components/LoadingIndicator.vue';

@Component({
  components: {
    LoadingIndicator,
    QrcodeCapture,
    QrcodeStream,
  }
})
export default class BallotTrackingQrScanner extends Vue {
  public isLoading: boolean = false;
  public openModal: boolean = false;
  public qrError: string = '';

  public async onDetect(
    processing: Promise<{ data: any; content: string; location: any }>
  ): Promise<void> {
    try {
      this.isLoading = true;
      this.qrError = '';
      const result = await processing;
      this.scanFinished(result.content);
    } catch (error) {
      this.scanError(error);
    } finally {
      this.isLoading = false;
      this.openModal = false;
    }
  }

  public async onInit(promise: Promise<any>): Promise<void> {
    try {
        await promise;
    } catch (error) {
      if (error.name === 'StreamApiNotSupportedError') {
        type ClickableElement = Element & { click: () => void };
        const qrCaptureEl: ClickableElement = (this.$refs.qrCapture as Vue).$el as ClickableElement;
        qrCaptureEl.click();
        this.openModal = false;
      }
    } finally {
      this.isLoading = false;
    }
  }

  public closeModal() {
    this.openModal = false;
  }

  private scanError(error: any): void {
    let message = error;
    if (error instanceof Error) {
      message = error.message;
    }
    this.qrError = this.$t('qrError', { message }).toString();
  }

  private scanFinished(result: any): void {
    if (!!result) {
      // only accept URLs formatted for tracking ballots in our app
      if (result.startsWith(`${window.location.origin}/track/`)) {
        const relativeUrl = result.replace(`${window.location.origin}/`, '');
        this.$router.push(relativeUrl);
      } else {
        this.scanError(this.$t('qrErrorInvalid'));
      }
    } else {
      // The picture didn't find a QR code to scan properly
      this.scanError(this.$t('qrErrorFailed'));
    }
  }
}
</script>

<style lang="scss">
    #qr {
        .button.is-large {
            font-size: 1rem;
            font-weight: 400;
            min-width: 10rem;
            height: 4rem;
        }
    }
</style>

