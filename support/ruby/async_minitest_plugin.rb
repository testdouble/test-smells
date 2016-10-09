module AsyncMinitestPlugin
  def before_setup
    super
    @preexisting_threads = Thread.list.dup
  end

  def after_teardown
    require "thwait"
    all_threads = Thread.list - @preexisting_threads
    ThreadsWait.all_waits(all_threads)
    super
  end
end

