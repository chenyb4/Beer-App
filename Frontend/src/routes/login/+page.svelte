<script>
  import { Button, Input, Label } from "flowbite-svelte";
  import { login } from "$lib/service/authentication.js";
  import { writable } from "svelte/store";
  import { goto } from "$app/navigation";
  import { t } from "$lib/translations";

  let username = "";
  let password = "";
  let errorMessage = "";
  let token = writable("");
  let loading = false;

  async function handleLogin() {
    if (username === "" || password === "") {
      errorMessage = $t("login.notFilled");
      console.log(errorMessage);
      return;
    }
    loading = true;
    try {
      const userToken = await login(username, password);
      localStorage.setItem("token", userToken);
      token.set(userToken);
      errorMessage = "";
      setTimeout(() => {
        loading = false;
        goto("/");
      }, 2500);
    } catch (error) {
      loading = false;
      errorMessage = $t("login.notCorrect");
    }
  }
</script>

<div class="content flex">
  {#if loading}
    <div
      class="absolute top-0 left-0 w-full h-full flex items-center justify-center"
    >
      <div
        class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20"
      ></div>
    </div>
  {:else}
    <div class="m-auto h-[50%] w-[45%] bg-dark-800 rounded-xl flex relative">
      <div class="h-full flex-1 flex flex-col justify-start p-6">
        <h1 class="text-white text-2xl mb-10">Welcome back!</h1>
        <Label for="username" class="text-white mb-2">Username:</Label>
        <Input
          required
          type="text"
          id="username"
          class="bg-dark-900 border-none mb-4 text-white"
          bind:value={username}
        ></Input>
        <Label for="password" class="text-white mb-2">Password:</Label>
        <Input
          required
          type="password"
          id="password"
          class="bg-dark-900 border-none text-white"
          bind:value={password}
        ></Input>
        <div
          class="text-red-400 mt-4 text-sm h-4 {errorMessage
            ? 'visible'
            : 'invisible'}"
        >
          {errorMessage}
        </div>
        <Button
          type="button"
          class="bg-dark-p_foreground p-4 rounded-full mt-8"
          on:click={handleLogin}
          disabled={loading}
        >
          LOGIN
        </Button>
      </div>

      <div class="h-[90%] w-0.5 bg-dark-900 flex items-center my-3"></div>

      <div class="h-full flex-1 flex justify-center items-center">
        <img src="src/lib/images/ada-logo.png" alt="Logo" class="w-32 h-auto" />
      </div>
    </div>
  {/if}
</div>

<style>
  .content {
    overflow: hidden;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-image: url("src/lib/images/login_background.svg");
  }

  .loader {
    border-color: #f3f4f6;
    border-top-color: #1f2937;
    animation: spin 1s infinite linear;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
