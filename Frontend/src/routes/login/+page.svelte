<script>
  import { Button, Input, Label } from "flowbite-svelte";

  let username = "";
  let password = "";
</script>

<div class="content flex">
  <div class="m-auto h-[50%] w-[45%] bg-dark-800 rounded-xl flex">
    <div class="h-full flex-1 flex flex-col justify-start p-6">
      <h1 class="text-white text-2xl mb-10">Welcome back!</h1>
      <Label for="username" class="text-white mb-2">Username:</Label>
      <Input
        required
        type="text"
        id="username"
        class="bg-dark-900 border-none mb-4"
        bind:value={username}
      ></Input>
      <Label for="password" class="text-white mb-2">Password:</Label>
      <Input
        required
        type="password"
        id="password"
        class="bg-dark-900 border-none mb-8"
        bind:value={password}
      ></Input>
      <Button type="submit" class="bg-dark-p_foreground p-4 rounded-full"
        >LOGIN</Button
      >
    </div>

    <div class="h-[90%] w-0.5 bg-dark-900 flex items-center my-3"></div>

    <div class="h-full flex-1 flex justify-center items-center">
      <img src="src/lib/images/ada-logo.png" alt="Logo" class="w-32 h-auto" />
    </div>
  </div>
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
</style>
