<script>
  import { goto } from "$app/navigation";
  import { t } from "$lib/translations";
  import logo from "$lib/images/ada-logo.png";
  import { Label } from "flowbite-svelte";

  let username = "";
  let password = "";
  let errorMessage = "";
  let loading = false;

  async function handleLogin(event) {
    event.preventDefault();
    loading = true;
    errorMessage = "";

    const formData = new FormData(event.target);

    const response = await fetch("/login", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    console.log(result);
    if (result.data === "[true]") {
      setTimeout(() => {
        loading = false;
        goto("/");
      }, 2500);
    } else {
      errorMessage = $t("login.notCorrect");
      loading = false;
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
        <form on:submit={handleLogin}>
          <Label for="username" class="text-white mb-2">Username:</Label>
          <input
            required
            type="text"
            id="username"
            name="username"
            class="bg-dark-900 border-none mb-4 text-white w-full rounded-xl"
            bind:value={username}
          />
          <Label for="password" class="text-white mb-2">Password:</Label>
          <input
            required
            type="password"
            id="password"
            name="password"
            class="bg-dark-900 border-none text-white w-full rounded-xl"
            bind:value={password}
          />
          <div
            class="text-red-400 mt-4 text-sm h-4 {errorMessage
              ? 'visible'
              : 'invisible'}"
          >
            {errorMessage}
          </div>
          <button
            type="submit"
            class="bg-dark-p_foreground p-4 rounded-full mt-8 text-white w-full"
            disabled={loading}
          >
            LOGIN
          </button>
        </form>
      </div>

      <div class="h-[90%] w-0.5 bg-dark-900 flex items-center my-3"></div>

      <div class="h-full flex-1 flex justify-center items-center">
        <img src={logo} alt="Logo" class="w-32 h-auto" />
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
    background-image: url("$lib/images/login_background.svg");
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
