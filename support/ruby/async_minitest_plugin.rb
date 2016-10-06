module AsyncMinitestPlugin
  def before_setup
    super
    @preexisting_threads = ObjectSpace.each_object(Thread).to_a
  end

  def after_teardown
    require "thwait"
    all_threads = ObjectSpace.each_object(Thread).to_a - @preexisting_threads
    ThreadsWait.all_waits(all_threads)
    super
  end
end

